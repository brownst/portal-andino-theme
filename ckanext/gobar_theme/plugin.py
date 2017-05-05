import ckan.plugins as plugins
import ckan.plugins.toolkit as toolkit
from ckan.plugins import implements, IRoutes
import ckanext.gobar_theme.helpers as gobar_helpers
import ckanext.gobar_theme.routing as gobar_routes
import ckanext.gobar_theme.actions as gobar_actions


class Gobar_ThemePlugin(plugins.SingletonPlugin):
    implements(plugins.IConfigurer)
    implements(IRoutes, inherit=True)
    implements(plugins.ITemplateHelpers)
    implements(plugins.IActions)

    def get_actions(self):
        return {'package_activity_list_html': gobar_actions.package_activity_list_html}

    def update_config(self, config_):
        toolkit.add_template_directory(config_, 'templates')
        toolkit.add_public_directory(config_, 'public')
        toolkit.add_resource('styles/css', 'gobar_css')
        toolkit.add_resource('js', 'gobar_js')
        toolkit.add_resource('recline', 'gobar_data_preview')

    def before_map(self, routing_map):
        gobar_router = gobar_routes.GobArRouter(routing_map)
        gobar_router.set_routes()
        return routing_map

    def get_helpers(self):
        return {
            'organization_tree': gobar_helpers.organization_tree,
            'get_faceted_groups': gobar_helpers.get_faceted_groups,
            'join_groups': gobar_helpers.join_groups,
            'cut_text': gobar_helpers.cut_text,
            'cut_img_path': gobar_helpers.cut_img_path,
            'organizations_with_packages': gobar_helpers.organizations_with_packages,
            'get_pkg_extra': gobar_helpers.get_pkg_extra,
            'get_facet_items_dict': gobar_helpers.get_facet_items_dict,
            'get_theme_config': gobar_helpers.get_theme_config,
            'url_join': gobar_helpers.url_join,
            'json_loads': gobar_helpers.json_loads,
            'update_frequencies': gobar_helpers.update_frequencies,
            'field_types': gobar_helpers.field_types,
            'render_ar_datetime': gobar_helpers.render_ar_datetime
        }
